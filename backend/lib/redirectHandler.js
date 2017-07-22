'use strict';

const Redirect = require('../models/Redirect');
const MissingRedirectError = require('../lib/error/MissingRedirectError');

class RedirectHandler {
  static handleRedirect(req, res) {
    if(!req.params.slug) return RedirectHandler.handleMissing(req.params.slug, res);
    const slug = req.params.slug;

    Redirect.findOne({ slug })
      .lean()
      .exec()
      .then((data) => {
        if(!data) return Promise.reject(new MissingRedirectError(slug));
        return res.redirect(data.defaultTarget);
      })
      .catch(MissingRedirectError, () => {
        RedirectHandler.handleMissing(slug, res);
      });
  }

  static handleMissing(slug, res) {
    return res.failMsg(`No matching redirect (${slug}) found.`);
  }
}

module.exports = RedirectHandler;
