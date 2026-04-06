'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Mail, Phone, User, X } from 'lucide-react';

const sampleMessages = [
  {
    id: '1',
    name: 'Rajesh Patel',
    email: 'rajesh@example.com',
    phone: '+91 9876543210',
    message: 'Interested in solar installation for my residential complex',
    date: '2024-01-15',
    read: false,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543211',
    message: 'Need quote for commercial solar system',
    date: '2024-01-14',
    read: true,
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null);

  const handleMarkRead = (id: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, read: true } : msg
      )
    );
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    setSelectedMessage(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">Contact Messages</h1>
        <p className="text-foreground/70">Manage inquiries and messages from visitors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`cursor-pointer border-muted hover:border-accent transition ${
                msg.read ? '' : 'bg-blue-50'
              }`}
              onClick={() => {
                setSelectedMessage(msg);
                handleMarkRead(msg.id);
              }}
            >
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-primary truncate">
                        {msg.name}
                      </p>
                      <p className="text-xs text-foreground/70">{msg.date}</p>
                    </div>
                  </div>
                  {!msg.read && (
                    <div className="ml-6 px-2 py-1 bg-accent text-accent-foreground text-xs rounded w-fit">
                      New
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="border-muted">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle>{selectedMessage.name}</CardTitle>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-foreground/50 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-foreground/70">Email</p>
                      <p className="font-medium">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-foreground/70">Phone</p>
                      <p className="font-medium">{selectedMessage.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-foreground/70 mb-2">Message</p>
                  <p className="text-foreground leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition"
                  >
                    Delete
                  </button>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
                  >
                    Reply
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-muted">
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-foreground/50">Select a message to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
