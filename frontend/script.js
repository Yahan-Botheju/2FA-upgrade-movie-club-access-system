const loginBtn = document.getElementById('btn-login');
const registerBtn = document.getElementById('btn-register');

async function userLogin(e) {
	e.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	try {
		const res = await fetch('http://127.0.0.1:5000/api/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ username, password }),
		});

		const data = await res.json();

		if (data.message === '2FA required') {
			localStorage.setItem('tempUserId', data.userId);

			window.location.href = 'verification.html';
		} else if (res.ok) {
			alert('login success');
			window.location.href = 'dashboard.html';
		} else {
			alert(data.message || 'login error');
		}
	} catch (error) {
		console.log(error);
		alert('server error');
	}
}

loginBtn.addEventListener('click', userLogin);

async function userRegister(e) {
	e.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	try {
		const res = await fetch('http://127.0.0.1:5000/api/users/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ username, password }),
		});

		const data = await res.json();

		if (res.ok) {
			window.location.href = 'index.html';
			alert(data.message || 'user register success');
		} else {
			alert(data.message);
		}
	} catch (error) {
		console.log(error);
		alert('server error');
	}
}

registerBtn.addEventListener('click', userRegister);
