'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const contentSections = [
  { id: 'hero', enLabel: 'Hero Section', hiLabel: 'हीरो सेक्शन' },
  { id: 'services', enLabel: 'Services', hiLabel: 'सेवाएं' },
  { id: 'about', enLabel: 'About Us', hiLabel: 'हमारे बारे में' },
  { id: 'contact', enLabel: 'Contact Info', hiLabel: 'संपर्क जानकारी' },
]

export default function AdminContentPage() {
  const { language } = useLanguage()
  const [selectedSection, setSelectedSection] = useState('hero')
  const [content, setContent] = useState({
    en: '',
    hi: '',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to Firebase
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>
          Content Editor
        </h1>
        <p className="text-muted-foreground">Edit bilingual content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {contentSections.map((section) => (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedSection(section.id)}
              >
                {language === 'hi' ? section.hiLabel : section.enLabel}
              </Button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">English Content</label>
              <Textarea
                placeholder="Enter English content..."
                value={content.en}
                onChange={(e) => setContent({ ...content, en: e.target.value })}
                className="min-h-48"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">हिंदी Content</label>
              <Textarea
                placeholder="हिंदी सामग्री दर्ज करें..."
                value={content.hi}
                onChange={(e) => setContent({ ...content, hi: e.target.value })}
                className="min-h-48"
              />
            </div>

            <div className="flex justify-between items-center">
              {saved && <p className="text-green-600 text-sm">✓ Saved successfully</p>}
              <Button
                onClick={handleSave}
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
