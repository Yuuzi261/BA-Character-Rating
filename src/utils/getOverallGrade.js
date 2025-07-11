export const getOverallGrade = (score) => {
  if (score >= 100) return 'SS'
  if (score >= 90) return 'S'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  if (score >= 40) return 'E'
  if (score >= 20) return 'F'
  return 'N/A'
}
