import { number, object, string, z } from "zod"
import { session_phases } from "./enums"

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const registerSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  surname: string({ required_error: "Surname is required" })
    .min(1, "Surname is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  schoolId: string({ required_error: "School is required" })
})

export const newClassSchema = object({
  class_grade: string({ required_error: "Class grade is required" })
    .min(1, "Class grade is required")
    .max(1, "Class grade is required"),
  class_section: string({ required_error: "Section is required" })
    .min(1, "Section is required"),
  female_number: number({ required_error: "" })
    .min(0, "People are not negative")
    .max(30, "Too many people"),
  male_number: number({ required_error: "" })
    .min(0, "People are not negative")
    .max(30, "Too many people"),
  details: string(),
  teacher_id: string({ required_error: "Teacher is required" })
    .min(1, "Teacher is required")
})

export const updateClassSchema = object({
  female_number: number({ required_error: "" })
    .min(0, "People are not negative")
    .max(30, "Too many people"),
  male_number: number({ required_error: "" })
    .min(0, "People are not negative")
    .max(30, "Too many people"),
  details: string(),
})

export const newSessionSchema = object({
  class_grade: string({ required_error: "Class grade is required" })
    .min(1, "Class grade is required")
    .max(1, "Class grade is required"),
  class_section: string({ required_error: "Section is required" })
    .min(1, "Section is required"),
  session_phase: z.enum([...(session_phases as [string, ...string[]])], {message: "Invalid session phase"}),
  details: string()
})

export const updateSessionSchema = object({
  teacher_id: string({ required_error: "Teacher is required" }),
  class_id: string({ required_error: "Class is required" }),
  session_code: string({ required_error: "Session code is required" }),
  session_phase: z.enum([...(session_phases as [string, ...string[]])], {message: "Invalid session phase"}),
  details: string()
})