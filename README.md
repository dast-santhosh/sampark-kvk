<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://hinduexistence.org/wp-content/uploads/2018/09/kvs-banner.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dTsJW9pNUT4mPRJP-4e0L0JJ8GmXp6ry

## Run Locally

**Prerequisites:**  Node.js

---

**About the App — SAMPARK KVK**

SAMPARK KVK is a unified digital platform designed for Kendriya Vidyalaya Karaikudi to streamline communication and academic coordination among School Administration, Teachers, and Parents. The app uses a secure triple-login system to deliver only the essential tools needed for daily school functioning, without unnecessary modules. Deployed on Vercel, it offers fast performance and reliable serverless infrastructure.

**Core Purpose**
SAMPARK KVK focuses on four goals:
• Clear communication (notices, announcements, messages)
• Organised academics (homework, notes, marks)
• Accurate attendance (daily + monthly summaries)
• Role-based access (Admin, Teacher, Parent)

---

### **Features by User Role**

**1. Admin**
• Create/manage teacher accounts
• View student details, reset parent logins
• Assign class/subject teachers
• Add holidays, events, circulars
• Upload timetable, exam schedules
• Attendance and marks overview
• Control messaging permissions

**2. Teacher**
• Create/edit student profiles
• Generate parent login accounts
• Daily attendance + monthly reports + PDF export
• Upload homework with deadlines and files
• Track submissions
• Enter marks; auto progress reports
• Class announcements and parent messaging
• Upload notes, worksheets, PDFs
• Access timetable

**3. Parent**
• View daily attendance + monthly chart
• Homework list
• All announcements
• Marks and downloadable progress reports
• Message class teacher
• View timetable, events, holidays, exam dates
• Download notes/homework files

---

**Why SAMPARK KVK Stands Out**
• Built specifically for KV workflows
• Clean, simple, essential interface
• Scalable Vercel deployment
• Easy for teachers and parents to use daily
• Secure, role-based access with minimal clutter

---


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
