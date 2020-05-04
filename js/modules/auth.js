class AuthModule {
	constructor() {
		this.userList = [{ username: 'p', password: 'p' }];
	}

	register(username, password) {
		this.userList.push({ username: username, password: password });
	}

	login(username, password) {
		if (this.userList.some((user) => user.username == username && user.password == password)) {
			router.navigate('game');
			return true;
		} else {
			return false;
		}
	}
}