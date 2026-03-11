document.getElementById('btn-enable-2fa').addEventListener('click', async () => {
  try {
    
    const res = await fetch('http://127.0.0.1:5000/api/users/2fa/setup', {
      method: 'POST',
      credentials:'include'
    })

    const data = await res.json();

    if (data.qrCode) {
      document.getElementById('qr-code-img').src = data.qrCode;
      document.querySelector('.container-img').style.display = 'block'
    }

  } catch (error) {
    alert('2fa setup faild')
  }
})



document.getElementById('btn-2fa-confirm').addEventListener('click', async () => {
  const code = document.getElementById('input-2fa-confirm').value

  try {
    const res = await fetch('http://127.0.0.1:5000/api/users/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
      credentials: 'include'
    })

    if (res.ok) {
      alert("2fa enable successful")
      window.location.reload()
    } else {
      alert('invalid code try again')
    }

  } catch (error) {
    alert('verification error')
  }
})

 

const form2 = document.getElementById('btn-logout')

async function userLogout(e) {
  if(e) e.preventDefault()

   try {
     const res = await fetch('http://127.0.0.1:5000/api/users/logout', {
       method: 'POST',
       credentials: 'include',
     }) 
     if (res.ok) {
      alert('logged out')
      window.location.href='index.html'
     } else {
       alert('logout error')
     }
   } catch (error) {
    console.log(error)
    alert('server error')
   }
}



form2.addEventListener('click', userLogout)  