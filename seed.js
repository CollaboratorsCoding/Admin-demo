const mongoose = require('mongoose');
const chalk = require('chalk');
const faker = require('faker');
const User = require('./src/admin/server/models/user');

if(!process.argv[2]) {
	return console.log(chalk.red("Please input how many users create in database!!!"))
}

mongoose.connect('mongodb://localhost:27017/demoapp', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.connection.on('connected', () => {
	console.log('Connected to database');
});
mongoose.connection.on('error', err => {
	console.log(`Connection error: ${err}`);
	mongoose.disconnect();
});

mongoose.connection.on('disconnected', () => {
	console.log('Database disconnected');
});

function exit(done) {
	console.log(chalk.green(`✔ ${done} users created in database`))
	mongoose.disconnect();
}

const users = [];
function generateUsers() {
	for (let i = 0; i < process.argv[2]; i++) {
		users.push(new User({
			isVerified: true,
			email: faker.internet.email(),
			name: faker.name.findName(),
			password: '12345678',
			age: Math.floor(Math.random() * (100 - 18+1) + 18)
		}))
	}
}

let done = 0;
function saveUsers() {
	for (let i = 0; i < users.length; i++) {
		users[i].save(() => {
			done++;
			if (done === users.length) {
				exit(done);
			}
		});
	}
}

(async () => {
	await generateUsers();
	await saveUsers();
})()

