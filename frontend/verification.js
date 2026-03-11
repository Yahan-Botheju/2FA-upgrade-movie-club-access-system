async function verifyOTP() {
  const code = document.getElementById('input-verify').value
  
  const userId = localStorage.getItem('tempUserId');
  
  if (!code || !userId) {
    alert('invalid relog required')
    return;
  }
  
  try {
    
    const res = await fetch('http://127.0.0.1:5000/api/users/login/2fa-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code }),
      credentials: 'include'
    })

    const data = await res.json();

    if (res.ok) {
      alert('verification success')
      localStorage.removeItem('tempUserId')
      window.location.href = 'dashboard.html'
    } else {
      alert(data.message || 'invalid code')
    }


  } catch (error) {
    console.log(error)
    alert('server error')
  }

}
 
document.getElementById('btn-verify').addEventListener('click', verifyOTP)