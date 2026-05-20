import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve(null)),
}))

jest.mock('@/lib/db', () => ({
  query: jest.fn(() => Promise.resolve({ rows: [
    {
        id: 1,
        name: "วัดพระแก้ว",
        description: "วัดพระศรีรัตนศาสดาราม หรือวัดพระแก้ว สถานที่ท่องเที่ยวอันดับหนึ่งที่ต้องมาเยือนในกรุงเทพฯ",
        location: "กรุงเทพมหานคร",
        rating: 4.9,
        image_url: "https://images.unsplash.com/photo-1528181304800-2f143c8c798d?auto=format&fit=crop&w=800&q=80",
    }
  ] })),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} fill={props.fill ? "true" : undefined} />
  },
}))

describe('Home', () => {
  it('renders the heading', async () => {
    const ResolvedHome = await Home()
    render(ResolvedHome)
    const heading = screen.getByRole('heading', { name: /ไทยเที่ยวไทย รีวิว/i, level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders the list of attractions from mock', async () => {
    const ResolvedHome = await Home()
    render(ResolvedHome)
    // Target the specific heading to avoid multiple matches with description
    expect(screen.getByRole('heading', { name: /วัดพระแก้ว/i, level: 3 })).toBeInTheDocument()
  })
})
