const fs = require('fs');
const fse = require('fs-extra');
const chalk = require('chalk');

fs.readdirSync("src").forEach(file => {
	if (file === "admin") {
		fse.copy(`src/${file}/server`, `build/src/${file}/server`, (err) => {
			if (err) return console.error(err);
			console.log(chalk.green(`✔ src/${file}/server copied to build/src/${file}`))
		});
	
	} else if (file !== "hocs" && file !== ".DS_Store") {
		fse.copy(`src/${file}`, `build/src/${file}`, (err) => {
			if (err) return console.error(err);
			console.log(chalk.green(`✔ src/${file} copied to build/src/${file}`))
		});
	}
})

fse.copy("bin", "build/bin", (err) => {
	if (err) return console.error(err);
	console.log(chalk.green('✔ bin copied to build/bin'))
});

fse.copy(".env.production", "build/.env", (err) => {
	if (err) return console.error(err);
	console.log(chalk.green('✔ .env.production copied to build/.env'))
});



fse.readJson("package.json", (err, data) => {
	fse.outputJson("build/package.json", {
		name: data.name,
		version: data.version,
		private: data.private,
		scripts: {
			start: "cross-env NODE_ENV=production node bin/www"
		},
		dependencies: data.dependencies
	}, {spaces: '\t'}, (err) => {
		if (err) return console.error(err);
		console.log(chalk.green("✔ package.json created"))	
	})
})


