import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import IPOPage from './pages/IPOPage'
import IPODetailPage from './pages/IPODetailPage'
import { IPOProvider } from './IPOContext'

const PAGES = {
  current: {
    path: '/ipo/current-ipo',
    props: {
      tab: 'current',
      bucket: 'current',
      title: 'Current IPOs — Apply for Live IPOs Online',
      blurb:
        'Browse all IPOs open for subscription right now. Review the price band, bidding period and issue size, then apply in a few taps with your Bajaj Broking Demat account.',
      emptyLabel: 'current IPOs',
    },
  },
  upcoming: {
    path: '/ipo/upcoming-ipo',
    props: {
      tab: 'upcoming',
      bucket: 'upcoming',
      title: 'Upcoming IPOs — Stay Ahead of New Listings',
      blurb:
        'Track IPOs opening soon. Get the expected price range, lot size and issue dates in advance so you are ready the moment bidding goes live.',
      emptyLabel: 'upcoming IPOs',
    },
  },
  closed: {
    path: '/ipo/closed-ipo',
    props: {
      tab: 'closed',
      bucket: 'closed',
      title: 'Closed IPOs — Subscription & Allotment Status',
      blurb:
        'See IPOs that have closed for bidding. Check overall subscription numbers, allotment dates and expected listing dates in one place.',
      emptyLabel: 'closed IPOs',
    },
  },
  performance: {
    path: '/ipo/ipo-performance',
    props: {
      tab: 'performance',
      bucket: 'performance',
      title: 'IPO Performance — How Recent Listings Fared',
      blurb:
        'Compare issue price against listing-day close for recently listed companies. Green marks a listing-day gain, red marks a loss.',
      emptyLabel: 'listed IPOs',
    },
  },
}

export default function App() {
  return (
    <IPOProvider>
      <Routes>
        {/* Standalone detail route — opened in a new browser tab, no site chrome */}
        <Route path="/ipo/detail/:id" element={<IPODetailPage />} />

        {/* Main site layout */}
        <Route path="*" element={<SiteLayout />} />
      </Routes>
    </IPOProvider>
  )
}

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/ipo/current-ipo" replace />} />
          <Route path="/ipo" element={<Navigate to="/ipo/current-ipo" replace />} />
          {Object.values(PAGES).map((p) => (
            <Route key={p.path} path={p.path} element={<IPOPage {...p.props} />} />
          ))}
          <Route path="*" element={<Navigate to="/ipo/current-ipo" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
