'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BakeryHour {
  id?: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}

export default function BakeryHoursAdmin() {
  const [hours, setHours] = useState<BakeryHour[]>([]); // Definer typen som en liste af BakeryHour
  const [newHour, setNewHour] = useState<BakeryHour>({
    dayOfWeek: '',
    openingTime: '',
    closingTime: '',
  });

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const res = await fetch('/api/bakers/1/hours'); // Juster baker ID dynamisk efter behov
        if (res.ok) {
          const data = await res.json();
          setHours(data);
        } else {
          console.error('Failed to fetch hours:', await res.text());
        }
      } catch (error) {
        console.error('Error fetching hours:', error);
      }
    };

    fetchHours();
  }, []);

  const handleAddHour = async () => {
    try {
      const res = await fetch('/api/bakers/1/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHour),
      });

      if (res.ok) {
        const addedHour = await res.json();
        setHours((prev) => [...prev, addedHour]);
        setNewHour({ dayOfWeek: '', openingTime: '', closingTime: '' });
      } else {
        console.error('Failed to add hour:', await res.text());
      }
    } catch (error) {
      console.error('Error adding hour:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Administrer Åbningstider</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tilføj Ny Åbningstid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dayOfWeek">Ugedag</Label>
              <Input
                id="dayOfWeek"
                value={newHour.dayOfWeek}
                onChange={(e) =>
                  setNewHour({ ...newHour, dayOfWeek: e.target.value })
                }
                placeholder="f.eks. Mandag"
              />
            </div>
            <div>
              <Label htmlFor="openingTime">Åbningstid</Label>
              <Input
                id="openingTime"
                type="time"
                value={newHour.openingTime}
                onChange={(e) =>
                  setNewHour({ ...newHour, openingTime: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="closingTime">Lukketid</Label>
              <Input
                id="closingTime"
                type="time"
                value={newHour.closingTime}
                onChange={(e) =>
                  setNewHour({ ...newHour, closingTime: e.target.value })
                }
              />
            </div>
            <Button onClick={handleAddHour}>Tilføj Åbningstid</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eksisterende Åbningstider</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {hours.map((hour) => (
              <li key={hour.id}>
                {hour.dayOfWeek}: {hour.openingTime} - {hour.closingTime}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
