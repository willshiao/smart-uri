'use strict';

const _ = require('lodash');
const config = require('config');

const Redirect = require('../models/Redirect');
const Request = require('../models/Request');
const MissingRedirectError = require('../lib/error/MissingRedirectError');

class RedirectHandler {
  static handleRedirect(req, res) {
    if(!req.params.slug) return RedirectHandler.handleMissing(req.params.slug, res);
    const slug = req.params.slug;

    RedirectHandler.logRequest(slug, req)
      .then(() => Redirect.findOne({ slug })
        .lean()
        .exec())
      .then((data) => {
        if(!data) return Promise.reject(new MissingRedirectError(slug));
        return res.redirect(data.defaultTarget);
      })
      .catch(MissingRedirectError, () => {
        RedirectHandler.handleMissing(slug, res);
      });
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

  static handleMissing(slug, res) {
    return res.failMsg(`No matching redirect (${slug}) found.`);
  }
}

module.exports = RedirectHandler;
