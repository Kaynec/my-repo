export interface Ticket {
  id: number
  title: string
  condition: string
  department: DepartmentOrImportance
  importance: DepartmentOrImportance
  created_at: string
  updated_at: string
}
export interface DepartmentOrImportance {
  id: number
  name: string
}
export interface Message {
  id: number
  ticket_id: number
  sender: number
  message: string
  files?: null[] | null
  created_at: string
}
