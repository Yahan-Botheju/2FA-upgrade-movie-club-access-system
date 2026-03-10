const form = document.getElementById('user-login')


async function userLogin(e) {
  e.preventDefault();

  const formData = new FormData(form);

  const username = formData.get('username');
  const password = formData.get('password');

  try {
    
    const res = await fetch('http://127.0.0.1:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login success',)
      window.location.href = 'dashboard.html'
    } else {
      alert('Login faild')
      
    }

  } catch (error) {
    console.log(error)
    alert('server error')
  }
}

form.addEventListener('submit', userLogin);

 