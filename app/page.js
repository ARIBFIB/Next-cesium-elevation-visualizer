'use client'
import { useAuth } from '@/lib/auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { CesiumMap } from '@/cesium/CesiumMap'
import { Navbar } from '@/components/Navbar'
// import styles from './page.module.css'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <CesiumMap />
        </main>
      </div>
    </ProtectedRoute>
  )
}