'use strict';

const _ = require('lodash');
const config = require('config');
const device = require('device');
const jsonLogic = require('json-logic-js');
const validator = require('validator');
const randomstring = require('randomstring');

const logger = require('../lib/logger').loggers.get('api');

const Redirect = require('../models/Redirect');
const Request = require('../models/Request');
const MissingRedirectError = require('../lib/error/MissingRedirectError');


class RedirectHandler {

  static handleGetRequests(req, res) {
    logger.info(`Request download initiated by: ${req.ip}`)

    res.set('Content-Type', 'text/plain');

    Request.find()
      .cursor()
      .on('data', (data) => {
        res.write(JSON.stringify(data) + '\n');
      })
      .on('end', () => {
        res.end();
      })
  }

  static handleDelete(req, res) {
    const isAdmin = (req.user.role >= config.get('user.roles.Admin'));
    if(!req.params || !req.params.id) return res.failMsg('Redirect ID required');
    const searchParams = { _id: req.params.id };
    if(!isAdmin) searchParams.owner = req.user._id; 

    let failed = false;
    Redirect.remove(searchParams)
      .lean()
      .exec()
      .then(({ result }) => {
        if(result.n <= 0) return res.failMsg('Redirect not found')
        logger.debug(`Successfully deleted: ${req.params.id}`)
        res.successJson()
      })
      .catch(err => RedirectHandler.handleError(res, err));
  }

  static handleGet(req, res) {
    const isAdmin = (req.user.role >= config.get('user.roles.Admin'))
    const query =  isAdmin ? {} : { owner: req.user._id }
    const fields = {
      name: 1,
      slug: 1,
      enabled: 1,
      defaultTarget: 1,
    }

    if(isAdmin) fields.owner = 1;
    const st = Redirect.find(query, fields);
    if(isAdmin) st.populate('owner');
    st
      .lean()
      .exec()
      .then((data) => {
        if (data.owner) {
          data.owner.email = (data.owner.email !== undefined) ? data.owner.email : null
        }
        res.successJson(data);
      })
      .catch(err => RedirectHandler.handleError(res, err));
  }

  static handleRedirect(req, res) {
    if(!req.params.slug) return RedirectHandler.handleMissing(req.params.slug, res);
    const slug = req.params.slug;
    const request = {
      slug,
      request: _.pick(req, config.get('request.properties')),
      ip: req.ip,
      result: '',
      createdAt: new Date(),
    };
    let target;

    Redirect.findOneAndUpdate({ slug }, { $inc: { 'stats.visits': 1 } })
      .lean()
      .exec()
      .then((data) => {
        if(!data) throw new MissingRedirectError(slug);
        if(data.extraInfo) RedirectHandler.extractInfo(request);
        request.visit = data.stats.visits;

        _(data.rules)
          .filter(rule => rule.enabled)
          .each((rule) => {
            const newTarget = RedirectHandler.checkRule(rule, request);

            if(newTarget !== null) {
              target = newTarget;
              return false;  // break
            }
          });
        if(target === undefined) target = data.defaultTarget;

        request.result = target;
        return new Request(request).save();
      })
      .then(() => {
        res.redirect(target);
      })
      .catch(MissingRedirectError, () => {
        RedirectHandler.handleMissing(slug, res);
      })
      .catch(err => RedirectHandler.handleError(res, err));
  }

  /**
   * Function to handle a POST request for new redirects
   * @param  {Express.Request}    req
   * @param  {Express.Response}   res
   */
  static async handleNew(req, res) {
    try {
      if(!req.body) return res.failMsg('JSON body required.');

      const props = ['rules', 'enabled', 'extraInfo', 'defaultTarget', 'slug', 'name'];  // Properties to keep from the JSON body
      const data = _.pick(req.body, props);
      const message = RedirectHandler.validateRedirect(data);
      if(message) return res.failMsg(message);

      if(req.user.role < config.get('user.roles.Admin') || !req.body.slug) {  // Only let the user pick the slug if he's an admin
        let dbRes = [];
        let count = 0;

        do {
          if(count++ > config.get('redirect.slugError')) {
            throw new Error('Too many slug collisions.');
          } else if(count > config.get('redirect.slugWarning')) {
            logger.warn(`Warning: slug collision #${count}`)
          }
          data.slug = RedirectHandler.generateSlug();
          dbRes = await Redirect.find({ slug: data.slug })
            .limit(1)
            .exec();
        } while(dbRes.length > 0);
      }
      data.owner = req.user._id;

      const redirect = new Redirect(data);
      await redirect.save();
      res.successJson(redirect);

    } catch(err) {
      RedirectHandler.handleError(res, err);
    }
  }

  /**
   * Function to handle a PUT request to update existing redirects
   * @param  {Express.Request}    req
   * @param  {Express.Response}   res
   */
  static async handleUpdate(req, res) {
    try {
      if(!req.body) return res.failMsg('JSON body required.');
      if(!req.params.id) return res.failMsg('Target required.');  // No need to validate actual objectID, will be checked in update call

      const props = ['rules', 'enabled', 'extraInfo', 'defaultTarget', 'name'];  // Properties to keep from the JSON body
      if(req.user.role >= config.get('user.roles.Admin')) props.push('slug');
      const data = _.pick(req.body, props);
      const message = RedirectHandler.validateRedirect(data);
      if(message) return res.failMsg(message);

      const redirect = await Redirect.findById(req.params.id);
      if(redirect.length < 1) return res.failMsg('Redirect not found.');

      if(req.user.role < config.get('user.roles.Admin') && req.user._id != redirect.owner) {
        logger.warn(`Attempt by ${req.user._id} to access redirect ${redirect._id}`);
        return res.failMsg('Insufficent permissions.');
      }

      await Redirect.update({ _id: req.params.id }, { $set: data });
      res.successJson();

    } catch(err) {
      RedirectHandler.handleError(res, err);
    }
  }

  static validateRedirect(r) {
    if(!r.name) return 'Name is required';
    if(r.name.length > config.get('redirect.nameMaxLength')) return 'Name is too long.';
    if(!r.defaultTarget) return 'Default target required';
    if(!validator.isURL(r.defaultTarget)) return 'Invalid default target';
    if(r.rules && r.rules.length > config.get('redirect.maxRules'))
      return `Too many rules: ${config.get('redirect.maxRules')} is the maximium allowed.`;

    for(let i = 0; i < r.rules.length; ++i) {
      const data = RedirectHandler.cleanRule(r.rules[i]);
      if(typeof data === 'string') return data;
      r.rules[i] = data;
    }
  }

  static cleanRule({ name = 'None', info = {}, type, enabled, stats, target }) {
    const end = `for rule "${name}"`;

    if(name.length > config.get('redirect.ruleNameMaxLength')) return `Name is too long ${end}`;
    if(target && !validator.isURL(target)) return `Invalid default target ${end}`;
    if(type === 'roundRobin') {
      if(!info.targets) return `Targets are required ${end}`;
      if(!info.targets.every(t => validator.isURL(t))) return `One of the targets is invalid ${end}`;
    } else if(type === 'jsonLogic') {
      if(!info.statement) return `Invalid JSON Logic statement ${end}`;
    } else {
      return `Invalid rule type ${end}`;
    }

    return { name, info, type, enabled, stats, target };
  }

  static extractInfo(req) {
    const dev = device(req.request.headers['user-agent'], config.get('request.device'));
    req.info = {
      isMobile: dev.is('phone'),
      isBot: dev.is('bot'),
      deviceType: dev.type,
      model: dev.model,
    };
  }

  static checkRule(rule, req) {
    if(rule.type === 'jsonLogic') {
      const result = jsonLogic.apply(rule.info.statement, req);

      if(rule.info.returnsUrl && validator.isURL(`${result}`)) return result;
      if(result) return rule.target;
      return null;
    }

    if(rule.type === 'roundRobin') {
      if(!rule.info.targets || rule.info.targets.length <= 0) return null;
      return rule.info.targets[(req.visit - 1) % rule.info.targets.length];
    }

    logger.error(`Invalid rule type: ${rule.type}`);
    return null;
  }

  static logRequest(slug, req) {
    const request = _.pick(req, config.get('request.properties'));
    return new Request({
      slug,
      request,
      ip: req.ip,
    })
      .save();
  }

  static handleError(res, err) {
    logger.error('Redirect error:', err);
    return res.errorJson(err);
  }

  static handleMissing(slug, res) {
    return res.failMsg(`No matching redirect (${slug}) found.`);
  }

  static generateSlug() {
    return randomstring.generate(config.get('redirect.slug'));
  }
}

module.exports = RedirectHandler;
