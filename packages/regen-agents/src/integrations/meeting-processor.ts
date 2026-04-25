/**
 * Meeting Processor Integration
 * 
 * Handles recording and retrieval of agent findings from meetings.
 */

import { AgentFinding, MeetingRecording } from '../types/index.js';

export class MeetingProcessor {
  private meetings: Map<string, MeetingRecording> = new Map();

  /**
   * Record agent findings from a meeting
   */
  async recordAgentFindings(
    meetingId: string,
    agentId: string,
    findings: AgentFinding[]
  ): Promise<void> {
    let meeting = this.meetings.get(meetingId);
    
    if (!meeting) {
      meeting = {
        meetingId,
        title: `Meeting ${meetingId}`,
        date: new Date(),
        attendees: [],
        actionItems: [],
        decisions: [],
        agentFindings: [],
      };
      this.meetings.set(meetingId, meeting);
    }

    for (const finding of findings) {
      meeting.agentFindings.push(finding);
    }

    console.log(`[MeetingProcessor] Recorded ${findings.length} findings for meeting ${meetingId}`);
  }

  /**
   * Get meeting by ID
   */
  async getMeeting(meetingId: string): Promise<MeetingRecording | null> {
    return this.meetings.get(meetingId) || null;
  }

  /**
   * Get all agent findings for a meeting
   */
  async getAgentFindings(meetingId: string, agentId?: string): Promise<AgentFinding[]> {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) return [];

    if (agentId) {
      return meeting.agentFindings.filter(f => f.agentId === agentId);
    }

    return meeting.agentFindings;
  }

  /**
   * Get meetings by date range
   */
  async getMeetingsByDateRange(start: Date, end: Date): Promise<MeetingRecording[]> {
    return Array.from(this.meetings.values())
      .filter(m => m.date >= start && m.date <= end)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Create a meeting record
   */
  async createMeeting(meeting: Omit<MeetingRecording, 'agentFindings'>): Promise<void> {
    this.meetings.set(meeting.meetingId, {
      ...meeting,
      agentFindings: [],
    });
  }

  /**
   * Update meeting details
   */
  async updateMeeting(
    meetingId: string,
    updates: Partial<Omit<MeetingRecording, 'agentFindings'>>
  ): Promise<void> {
    const meeting = this.meetings.get(meetingId);
    if (meeting) {
      Object.assign(meeting, updates);
    }
  }

  /**
   * Get all findings by agent
   */
  async getFindingsByAgent(agentId: string): Promise<{ meetingId: string; finding: AgentFinding }[]> {
    const results: { meetingId: string; finding: AgentFinding }[] = [];

    for (const meeting of this.meetings.values()) {
      for (const finding of meeting.agentFindings) {
        if (finding.agentId === agentId) {
          results.push({ meetingId: meeting.meetingId, finding });
        }
      }
    }

    return results;
  }

  /**
   * Get findings by topic
   */
  async getFindingsByTopic(topic: string): Promise<{ meetingId: string; finding: AgentFinding }[]> {
    const results: { meetingId: string; finding: AgentFinding }[] = [];

    for (const meeting of this.meetings.values()) {
      for (const finding of meeting.agentFindings) {
        if (finding.relatedTopics.includes(topic)) {
          results.push({ meetingId: meeting.meetingId, finding });
        }
      }
    }

    return results;
  }
}
