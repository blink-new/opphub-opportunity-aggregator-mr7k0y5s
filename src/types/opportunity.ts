export interface Opportunity {
  id: string
  title: string
  description: string
  category: 'internship' | 'hackathon' | 'contest' | 'scholarship'
  source: 'unstop' | 'devfolio' | 'hackerearth' | 'other'
  deadline: string
  location: string
  eligibility: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  applyUrl: string
  isBookmarked: boolean
  applicationStatus?: 'not_applied' | 'applied' | 'shortlisted' | 'rejected' | 'accepted'
  createdAt: string
  updatedAt: string
}

export interface OpportunityFilters {
  category?: string
  source?: string
  location?: string
  difficulty?: string
  deadline?: string
  search?: string
}