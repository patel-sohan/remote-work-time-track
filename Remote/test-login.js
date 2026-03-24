async function testLogin() {
  try {
    console.log('🔍 Testing manager login...');

    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'dhchaudhary973@gmail.com',
        password: 'dhp@973'
      })
    });

    const data = await response.json();

    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Login successful!');
      console.log('👤 User:', data.data.user.firstName, data.data.user.lastName);
      console.log('🎯 Role:', data.data.user.role);
    } else {
      console.log('❌ Login failed:', data.message);
    }

  } catch (error) {
    console.error('💥 Error testing login:', error.message);
  }
}

testLogin();
