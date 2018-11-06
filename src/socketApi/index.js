const socketIo = require('socket.io');
// const _ = require('lodash');
const sharedsession = require('express-socket.io-session');
const Message = require('mongoose').model('Message');

const io = socketIo();

const connectedUsers = [];
const socketInit = session => {
	io.use(
		sharedsession(session, {
			autoSave: true,
		}
		)
	);
	io.on('connection', socket => {
		connectedUsers.push({
			isAdmin: !!socket.handshake.session.token,
			socketId: socket.id,
		});
		
		if (socket.handshake.session.token) {
			socket.join('admins');
		}
		console.log('User connected', connectedUsers, connectedUsers.length);
		io.to('admins').emit('user_counter', connectedUsers.length) 
		socket.on('get_count', () => {
			io.to('admins').emit('user_counter', connectedUsers.length)
		});

		socket.on('message_send', data => {
			const message = {
				date: Date.now(),
				parentId: 'admin',
				parentCollection: 'users',
				...data
			};

			Message.create(message, (err, msg) => {
				if (err) return;
				io.to('admins').emit('message_receive', msg);
			});
		});

		socket.on('disconnect', () => {
			if (socket.handshake.session.adminData) {
				socket.leave('admins');
			}
			const oneClient = connectedUsers.filter(
				user => user.socketId === socket.id
			);
			const index = connectedUsers.indexOf(oneClient[0]);
			connectedUsers.splice(index, 1);
			console.log(
				'User disconnected',
				connectedUsers,
				connectedUsers.length
			);
			socket.broadcast.to('admins').emit('user_counter', connectedUsers.length)
		});
	});
};

exports.socketInit = socketInit;
exports.io = io;

