const db = require('../../data/db-config.js');

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
    .count('st.step_id as number_of_steps')
    .select('sc.scheme_id as scheme_id', 'sc.scheme_name')
}

async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
  const result = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .select('sc.scheme_name', 'st.step_id', 'st.step_number', 'instructions', 'sc.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number', 'ASC');

      if(result.length < 1) {
        return null;
      }

      const scheme = {
        scheme_id: result[0].scheme_id,
        scheme_name: result[0].scheme_name,
        steps: []
      };

      if(result[0].step_id == null) {
        return scheme;
      }

      for(let step of result) {
        scheme.steps.push({
          step_id: step.step_id,
          step_number: step.step_number,
          instructions: step.instructions
        });
      }
      return scheme;
}

function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
 /*
      SELECT
          sc.scheme_name,
          st.*
      FROM steps as st
      LEFT JOIN schemes as sc
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 2
      ORDER BY st.step_number ASC;
 */
    
  return db('steps as st')
    .leftJoin('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id', 'st.step_number', 'instructions', 'sc.scheme_name')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'ASC')
}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  return db('schemes')
    .insert(scheme)
    .then(([id]) => { // eslint-disable-linne
      return findById(id);
    })
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 const toInsert = {
   scheme_id: scheme_id,
   ...step
 }
  return db('steps')
    .insert(toInsert)
    .then(() => {
      return findSteps(scheme_id);
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
