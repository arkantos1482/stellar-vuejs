export default function ({store, route, redirect}) {
    const myRoute = route.fullPath.toLowerCase();
    if (!store.state.auth.isLoggedIn) {
        if ('/login' !== myRoute && '/register' !== myRoute && '/otp' !== myRoute) {
            // return redirect('/login')
        }
    }
}