import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { OpportunityFilters } from '@/types/opportunity'

interface SidebarProps {
  filters: OpportunityFilters
  onFiltersChange: (filters: OpportunityFilters) => void
}

export function Sidebar({ filters, onFiltersChange }: SidebarProps) {
  const updateFilter = (key: keyof OpportunityFilters, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="w-80 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <Select value={filters.category || 'all'} onValueChange={(value) => updateFilter('category', value === 'all' ? undefined : value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="internship">Internships</SelectItem>
              <SelectItem value="hackathon">Hackathons</SelectItem>
              <SelectItem value="contest">Contests</SelectItem>
              <SelectItem value="scholarship">Scholarships</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Source Platform</Label>
          <Select value={filters.source || 'all'} onValueChange={(value) => updateFilter('source', value === 'all' ? undefined : value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="unstop">Unstop</SelectItem>
              <SelectItem value="devfolio">Devfolio</SelectItem>
              <SelectItem value="hackerearth">HackerEarth</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Difficulty Level</Label>
          <Select value={filters.difficulty || 'all'} onValueChange={(value) => updateFilter('difficulty', value === 'all' ? undefined : value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Location</Label>
          <Select value={filters.location || 'all'} onValueChange={(value) => updateFilter('location', value === 'all' ? undefined : value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="india">India</SelectItem>
              <SelectItem value="usa">USA</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="trending" />
            <Label htmlFor="trending" className="text-sm">Trending</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="deadline-soon" />
            <Label htmlFor="deadline-soon" className="text-sm">Deadline Soon</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="high-reward" />
            <Label htmlFor="high-reward" className="text-sm">High Reward</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="no-fee" />
            <Label htmlFor="no-fee" className="text-sm">No Application Fee</Label>
          </div>
        </div>
      </Card>
    </div>
  )
}