insert into public.past_papers (teacher_name, department, semester, course, year, file_url)
values
  ('Dr. Adeel Memon', 'Computer Systems', 'Semester 5', 'Data Structures', 2024, 'https://example.com/papers/data-structures-2024.pdf'),
  ('Prof. Sana Qazi', 'Software', 'Semester 6', 'Software Engineering', 2023, 'https://example.com/papers/software-engineering-2023.pdf'),
  ('Dr. Kamran Ali', 'Electrical', 'Semester 4', 'Circuit Analysis', 2022, 'https://example.com/papers/circuit-analysis-2022.pdf');

insert into public.achievements (student_name, department, achievement_title, description, github_link, linkedin_link, photo_url)
values
  ('Areeba Shaikh', 'Software', 'Google Summer of Code', 'Selected for GSoC and contributed to a major open-source project.', 'https://github.com/areeba', 'https://linkedin.com/in/areeba', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop'),
  ('Mubashir Khan', 'Computer Systems', 'Dean''s Gold Medal', 'Graduated with top distinction in the Computer Systems department.', 'https://github.com/mubashirkhan', 'https://linkedin.com/in/mubashirkhan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop'),
  ('Sadia Panhwar', 'Civil', 'International Research Publication', 'Published a peer-reviewed paper on sustainable structural materials.', null, 'https://linkedin.com/in/sadia-panhwar', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=256&h=256&fit=crop');
