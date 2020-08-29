function TestData() {
    this.login = {
        email: 'test123@test123.se',
        password: 'aaaaaaaa' 
    }
    
    this.signUp1 = { //complete success
        name: 'Egyuik wewewe',
        email: 'test123@test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp2 = { // invalid name and email (misses "."), password too short and doesn't match comfirm
        name: 'Egyuik',
        email: 'test123@test123se',
        password: 'aaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp3 = { // invalid name and email (misses "@"), comfirm doesn't match password
        name: 'Egyuik',
        email: 'test123test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaa',
    }
    this.cookie = () => { // true; hej; false;
        cookie.create('name', 'hej', 5)
        console.log(cookie.check('name'))
        console.log(cookie.get('name'))
        cookie.destroy('name')
        console.log(cookie.check('name'))
    }
}