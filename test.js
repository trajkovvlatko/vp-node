const User = require('./app/models/user_model');
const Performer = require('./app/models/performer_model');
const Venue = require('./app/models/venue_model');

(async () => {
  try {
    // Get performers for a user
    /*     const user = await User.findByPk(110);
    console.log(user.dataValues);
    const performers = await user.getPerformers();
    console.log(performers); */

    // get all performers
    // const performers = await Performer.all();
    // console.log(performers[0].id);

    const performer = await Performer.find(20);
    console.log(performer)
    performer.AsRequester.forEach((p) => {
      console.log(p.dataValues);
    });
    console.log('-----');
    performer.AsRequested.forEach((p) => {
      console.log(p.dataValues);
    });

  } catch (error) {
    console.error('ERR:', error);
  }
})();
