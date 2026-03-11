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
    
    if (data.message === '2FA required') {
      localStorage.setItem('tempUserId', data.userId);
      
      window.location.href = 'verification.html'
    } else if (res.ok) {
      alert('login success')
      window.location.href = 'dashboard.html'
    } else {
      alert(data.message || 'login error')
    }
    
    
  } catch (error) {
    console.log(error)
    alert('server error')
  }
}

form.addEventListener('submit', userLogin);

