import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Code, Trophy, GraduationCap } from 'lucide-react'

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  counts: Record<string, number>
}

export function CategoryTabs({ activeCategory, onCategoryChange, counts }: CategoryTabsProps) {
  const categories = [
    { id: 'all', label: 'All Opportunities', icon: null },
    { id: 'internship', label: 'Internships', icon: Briefcase },
    { id: 'hackathon', label: 'Hackathons', icon: Code },
    { id: 'contest', label: 'Contests', icon: Trophy },
    { id: 'scholarship', label: 'Scholarships', icon: GraduationCap },
  ]

  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto p-1">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {counts[category.id] || 0}
              </Badge>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}