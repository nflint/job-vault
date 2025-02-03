/**
 *
 */
async function seedResume() {
  try {
    const response = await fetch('http://localhost:3000/api/resume/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log('Response:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

seedResume() 