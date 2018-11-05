const TestController = {};

TestController.get_test = (req, res) => {
	res.json({title: 'test api from app1'});
}

module.exports = TestController;
