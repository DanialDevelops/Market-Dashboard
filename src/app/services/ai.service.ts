import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PriceData } from './app-store.service';

export interface MarketSentiment {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  keyPoints: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MarketAnalysisService {

  generateTechnicalAnalysis(symbol: string, prices: PriceData[]): Observable<string> {
    const analysisTemplates = [
      `${symbol} demonstrates strong upward momentum with bullish technical indicators supporting continued price appreciation.`,
      `${symbol} is consolidating within a defined range. Wait for clear breakout signals before significant position changes.`,
      `${symbol} shows elevated volatility. Implement proper risk management and monitor key support/resistance levels.`,
      `Technical patterns suggest ${symbol} is at a critical decision point with volume confirming trend continuation.`,
      `${symbol} maintains solid fundamentals despite price fluctuations, with favorable long-term technical outlook.`
    ];

    const selectedAnalysis = analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
    
    return of(selectedAnalysis).pipe(
      delay(1200)
    );
  }

  analyzeMarketSentiment(symbol: string): Observable<MarketSentiment> {
    const sentimentTypes = ['bullish', 'bearish', 'neutral'] as const;
    const selectedSentiment = sentimentTypes[Math.floor(Math.random() * sentimentTypes.length)];
    
    const sentimentAnalysis = {
      bullish: {
        points: [
          'Strong upward price momentum',
          'Positive moving average crossovers',
          'Supportive volume patterns'
        ]
      },
      bearish: {
        points: [
          'Downward price pressure',
          'Weakening momentum indicators',
          'Negative market sentiment'
        ]
      },
      neutral: {
        points: [
          'Sideways trading pattern',
          'Mixed technical signals',
          'Awaiting market catalyst'
        ]
      }
    };

    return of({
      sentiment: selectedSentiment,
      confidence: Math.floor(Math.random() * 35) + 65,
      keyPoints: sentimentAnalysis[selectedSentiment].points
    }).pipe(delay(800));
  }
}