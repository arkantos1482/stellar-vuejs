export default function ({store, route, redirect}) {
    console.log('auth middleware')
    const myRoute = route.fullPath.toLowerCase();
    if (!store.state.auth.isLoggedIn) {
        if ('/login' !== myRoute && '/register' !== myRoute && '/otp' !== myRoute) {
            console.log('IF auth middleware !!')
            // return redirect('/login')
        }
    }
}