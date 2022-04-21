const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const config = {
  logging: false
};

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config);

const User = conn.define('user', {
  username: STRING,
  password: STRING
});

// 1. create Note model 
const Note = conn.define('note', {
  txt: {
    type: STRING,
    allowNull: false,
    validate: {
    notEmpty: true
    }
  }
});

Note.belongsTo(User);
User.hasMany(Note);

User.addHook('beforeSave', async(user)=> {
  if(user.changed('password')){
    const hashed = await bcrypt.hash(user.password, 3);
    user.password = hashed;
  }
});

User.byToken = async(token)=> {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(payload.id, {
      attributes: {
        exclude: ['password']
      }
    });
    if(user){
      return user;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

User.authenticate = async({ username, password })=> {
  const user = await User.findOne({
    where: {
      username
    }
  });
  if(user && await bcrypt.compare(password, user.password) ){
    return jwt.sign({ id: user.id}, process.env.JWT); 
  }
  const error = Error('bad credentials!!!!!!');
  error.status = 401;
  throw error;
};

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: 'lucy_pw'},
    { username: 'moe', password: 'moe_pw'},
    { username: 'larry', password: 'larry_pw'}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  ); // add async/await inside of map to control order (32:00 in vid)

  // const notes = [ 
  //   { text: 'hello world' }, 
  //   { text: 'reminder to buy groceries' }, 
  //   { text: 'reminder to do laundry' } 
  // ];
  // const [note1, note2, note3] = await Promise.all(
  //   notes.map( note => Note.create(note))
  // );
  // await lucy.setNotes(note1);
  // await moe.setNotes([note2, note3])

  // Use await Promise.all if you don't care about the order of whats created first, etc. 
  await Promise.all([
  Note.create({txt: 'Doctors Appt @ 2pm', userId: lucy.id}),
  Note.create({txt: 'Buy Food', userId: lucy.id}),
  Note.create({txt: 'Study Algos', userId: moe.id}),  
  Note.create({txt: 'Clean House', userId: moe.id}),
  Note.create({txt: 'Finish HW', userId: larry.id}),
  Note.create({txt: 'Meal Prep', userId: larry.id}),
  ]);  

  return {
    users: {
      lucy,
      moe,
      larry
    }
  };
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Note
  }
};
