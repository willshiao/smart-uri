'use strict';

const _ = require('lodash');
const config = require('config');
const device = require('device');
const jsonLogic = require('json-logic-js');

const logger = require('../lib/logger').loggers.get('api');

const Redirect = require('../models/Redirect');
const Request = require('../models/Request');
const MissingRedirectError = require('../lib/error/MissingRedirectError');

class RedirectHandler {
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

    Redirect.findOne({ slug })
      .lean()
      .exec()
      .then((data) => {
        if(!data) return Promise.reject(new MissingRedirectError(slug));
        if(data.extraInfo) RedirectHandler.extractInfo(request);

        _(data.rules)
          .filter(rule => rule.enabled)
          .some((rule) => {
            logger.debug('Trying rule: ', rule);
            if(RedirectHandler.checkRule(rule, request)) {
              target = rule.target;
              return true;
            }
            return false;
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
    if(rule.isLogicRule) return jsonLogic.apply(rule.condition, req);
    logger.error(`Invalid rule type: ${rule.condition}`);
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
    return res.errorJson(err);
  }

  static handleMissing(slug, res) {
    return res.failMsg(`No matching redirect (${slug}) found.`);
  }
}

module.exports = RedirectHandler;
