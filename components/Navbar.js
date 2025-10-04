'use client'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
// import styles from './Navbar.module.css'

export function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Cesium Elevation Analysis</Link>
      </div>
      <div className={styles.navItems}>
        {user ? (
          <>
            <span className={styles.userInfo}>Welcome, {user.name}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className={styles.navLink}>
              Login
            </Link>
            <Link href="/auth/register" className={styles.navLink}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}