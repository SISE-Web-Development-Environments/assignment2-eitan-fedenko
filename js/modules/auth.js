class AuthModule {
	constructor() {
		this.userList = [{ username: 'p', password: 'p', name: 'Test User (p)' }];
	}

	register(username, password, name) {
		this.userList.push({ username: username, password: password, name: name });
	}

	login(username, password) {
		this.currentUser = this.userList.find((user) => user.username == username && user.password == password);

		return this.currentUser !== undefined;
	}

	getUser() {
		return this.currentUser;
	}
}