import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PriceData } from './app-store.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  summarizeStock(symbol: string, prices: PriceData[]): Observable<string> {
    // Mock AI analysis - in a real app, this would call an AI API
    const mockInsights = [
      `${symbol} shows strong momentum with recent price action indicating bullish sentiment. The technical indicators suggest continued upward movement.`,
      `Current market conditions for ${symbol} indicate consolidation. Consider waiting for a clear breakout before making major position changes.`,
      `${symbol} is experiencing high volatility. Risk management is crucial at current levels. Monitor key support and resistance levels closely.`,
      `Technical analysis suggests ${symbol} may be approaching a key decision point. Volume patterns support potential trend continuation.`,
      `${symbol} fundamentals remain strong despite recent price fluctuations. Long-term outlook appears favorable based on current indicators.`
    ];

    const randomInsight = mockInsights[Math.floor(Math.random() * mockInsights.length)];
    
    return of(randomInsight).pipe(
      delay(1500) // Simulate API call delay
    );
  }

  getMarketSentiment(symbol: string): Observable<{
    sentiment: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    keyPoints: string[];
  }> {
    const sentiments = ['bullish', 'bearish', 'neutral'] as const;
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    const keyPointsMap = {
      bullish: [
        'Strong upward price momentum',
        'Moving averages showing positive crossover',
        'Volume supporting price increases'
      ],
      bearish: [
        'Downward pressure on price action',
        'Indicators showing weakening momentum',
        'Market sentiment appears negative'
      ],
      neutral: [
        'Sideways trading pattern observed',
        'Mixed signals from technical indicators',
        'Market waiting for catalyst'
      ]
    };

    return of({
      sentiment: randomSentiment,
      confidence: Math.random() * 40 + 60, // 60-100%
      keyPoints: keyPointsMap[randomSentiment]
    }).pipe(delay(1000));
  }
}