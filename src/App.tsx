import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { CategoryTabs } from '@/components/opportunities/CategoryTabs'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import { PersonalDashboard } from '@/components/dashboard/PersonalDashboard'
import { mockOpportunities } from '@/data/mockOpportunities'
import { OpportunityFilters } from '@/types/opportunity'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SlidersHorizontal, Grid, List, User, Search } from 'lucide-react'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [filters, setFilters] = useState<OpportunityFilters>({})
  const [showSidebar, setShowSidebar] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('opportunities')

  // Filter opportunities based on search, category, and filters
  const filteredOpportunities = useMemo(() => {
    return mockOpportunities.filter(opportunity => {
      // Search filter
      if (searchQuery && !opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !opportunity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }

      // Category filter
      if (activeCategory !== 'all' && opportunity.category !== activeCategory) {
        return false
      }

      // Additional filters
      if (filters.source && opportunity.source !== filters.source) return false
      if (filters.difficulty && opportunity.difficulty !== filters.difficulty) return false
      if (filters.location && opportunity.location !== filters.location) return false

      return true
    })
  }, [searchQuery, activeCategory, filters])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      all: mockOpportunities.length,
      internship: 0,
      hackathon: 0,
      contest: 0,
      scholarship: 0
    }

    mockOpportunities.forEach(opportunity => {
      counts[opportunity.category]++
    })

    return counts
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading OppHub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            {/* Category Tabs */}
            <div>
              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                counts={categoryCounts}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <p className="text-muted-foreground">
                  {filteredOpportunities.length} opportunities found
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Sidebar */}
              <div className={`${showSidebar ? 'block' : 'hidden'} lg:block`}>
                <Sidebar filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {filteredOpportunities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={() => {
                      setFilters({})
                      setSearchQuery('')
                      setActiveCategory('all')
                    }}>
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredOpportunities.map(opportunity => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <PersonalDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App