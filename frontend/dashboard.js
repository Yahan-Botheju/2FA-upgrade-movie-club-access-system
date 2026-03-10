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