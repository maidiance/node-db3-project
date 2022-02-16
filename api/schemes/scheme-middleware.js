const db = require('../../data/db-config');
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const scheme = await db('schemes').where('id', req.params.id).first();
  if (scheme) {
    next();
  } else {
    res.status(404).json({message: 'scheme with scheme_id <actual id> not found'});
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const name = req.body.scheme_name;
  if(!name || name == null || typeof(name) != 'string') {
    res.status(400).json({message: 'invalid scheme_name'});
  } else {
    next();
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const instructions = req.body.instructions;
  const steps = req.body.step_number;
  if(!instructions || instructions == null || typeof(instructions) != 'string'
   || typeof(steps) != 'number' || steps < 1) {
     res.status(400).json({message: 'invalid step'});
   } else {
     next();
   }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
