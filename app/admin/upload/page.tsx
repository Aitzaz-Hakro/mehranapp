import { UploadPaperForm } from "@/components/admin/upload-paper-form";

const departments = [
   "Computer Systems",
   "Computer Science",
   "Artificial Intelligence",
   "Cyber Security",
   "Telecommunication",
   "BBA",
   "Textile",
   "Architecture", 
   "Mathematics", 
   "English", 
   "Electronics",
   "Petroleum & NG",
   "Chemical",  
   "Metallurgy",
   "Minning",
   "Industrial",
   "Biomedical",
   "Environmental Engineering",
   "Environmental Science",
   "City Regional Planning",
   "Mechatronics",
   "Software", 
   "Electrical",
   "Civil", 
   "Mechanical",
     ];
const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export const dynamic = "force-dynamic";

export default function AdminUploadPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-[#002147]">Admin Upload</h1>
      <p className="mb-6 text-sm text-black/70">
        Upload and publish MUET past papers to the student archive.
      </p>
      <UploadPaperForm departments={departments} semesters={semesters} />
    </section>
  );
}
