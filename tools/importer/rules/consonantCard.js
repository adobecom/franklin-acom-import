export default function createConsonantCardBlock(block, document) {
  const cardCollection = document.createElement('a');
  cardCollection.href = 'https://milo.adobe.com/tools/caas#eyJhZGRpdGlvbmFsUmVxdWVzdFBhcmFtcyI6W10sImFuYWx5dGljc0NvbGxlY3Rpb25OYW1lIjoiIiwiYW5hbHl0aWNzVHJhY2tJbXByZXNzaW9uIjpmYWxzZSwiYW5kTG9naWNUYWdzIjpbXSwiYXV0b0NvdW50cnlMYW5nIjpmYWxzZSwiYm9va21hcmtJY29uU2VsZWN0IjoiIiwiYm9va21hcmtJY29uVW5zZWxlY3QiOiIiLCJjYXJkU3R5bGUiOiIxOjIiLCJjYXJkVGl0bGVBY2Nlc3NpYmlsaXR5TGV2ZWwiOjYsImNvbGxlY3Rpb25CdG5TdHlsZSI6InByaW1hcnkiLCJjb2xsZWN0aW9uTmFtZSI6IiIsImNvbGxlY3Rpb25UaXRsZSI6IiIsImNvbGxlY3Rpb25TaXplIjoiIiwiY29udGFpbmVyIjoiMTIwME1heFdpZHRoIiwiY29udGVudFR5cGVUYWdzIjpbImNhYXM6Y29udGVudC10eXBlL2FydGljbGUiXSwiY291bnRyeSI6ImNhYXM6Y291bnRyeS91cyIsImN1c3RvbUNhcmQiOiIiLCJjdGFBY3Rpb24iOiJfc2VsZiIsImRvTm90TGF6eUxvYWQiOmZhbHNlLCJkaXNhYmxlQmFubmVycyI6ZmFsc2UsImRyYWZ0RGIiOmZhbHNlLCJlbmRwb2ludCI6Ind3dy5hZG9iZS5jb20vY2hpbWVyYS1hcGkvY29sbGVjdGlvbiIsImVudmlyb25tZW50IjoiIiwiZXhjbHVkZWRDYXJkcyI6W10sImV4Y2x1ZGVUYWdzIjpbXSwiZmFsbGJhY2tFbmRwb2ludCI6IiIsImZlYXR1cmVkQ2FyZHMiOltdLCJmaWx0ZXJFdmVudCI6IiIsImZpbHRlckxvY2F0aW9uIjoibGVmdCIsImZpbHRlckxvZ2ljIjoib3IiLCJmaWx0ZXJzIjpbXSwiZmlsdGVyc1Nob3dFbXB0eSI6ZmFsc2UsImd1dHRlciI6IjR4IiwiaW5jbHVkZVRhZ3MiOlsiY2FhczpidXNpbmVzcy11bml0L2RvY3VtZW50LWNsb3VkIiwiY2Fhczpwcm9kdWN0cy9hY3JvYmF0Il0sImxhbmd1YWdlIjoiY2FhczpsYW5ndWFnZS9lbiIsImxheW91dFR5cGUiOiI0dXAiLCJsb2FkTW9yZUJ0blN0eWxlIjoicHJpbWFyeSIsIm9ubHlTaG93Qm9va21hcmtlZENhcmRzIjpmYWxzZSwib3JMb2dpY1RhZ3MiOltdLCJwYWdpbmF0aW9uQW5pbWF0aW9uU3R5bGUiOiJwYWdlZCIsInBhZ2luYXRpb25FbmFibGVkIjpmYWxzZSwicGFnaW5hdGlvblF1YW50aXR5U2hvd24iOmZhbHNlLCJwYWdpbmF0aW9uVHlwZSI6InBhZ2luYXRvciIsInBhZ2luYXRpb25Vc2VUaGVtZTMiOmZhbHNlLCJwbGFjZWhvbGRlclVybCI6IiIsInJlc3VsdHNQZXJQYWdlIjoiNCIsInNlYXJjaEZpZWxkcyI6W10sInNldENhcmRCb3JkZXJzIjp0cnVlLCJzaG93Qm9va21hcmtzRmlsdGVyIjpmYWxzZSwic2hvd0Jvb2ttYXJrc09uQ2FyZHMiOmZhbHNlLCJzaG93RmlsdGVycyI6ZmFsc2UsInNob3dTZWFyY2giOmZhbHNlLCJzaG93VG90YWxSZXN1bHRzIjpmYWxzZSwic29ydERhdGVBc2MiOmZhbHNlLCJzb3J0RGF0ZURlc2MiOmZhbHNlLCJzb3J0RGF0ZU1vZGlmaWVkIjpmYWxzZSwic29ydERlZmF1bHQiOiJyYW5kb20iLCJzb3J0RW5hYmxlUG9wdXAiOnRydWUsInNvcnRFbmFibGVSYW5kb21TYW1wbGluZyI6dHJ1ZSwic29ydEV2ZW50U29ydCI6ZmFsc2UsInNvcnRGZWF0dXJlZCI6ZmFsc2UsInNvcnRNb2RpZmllZEFzYyI6ZmFsc2UsInNvcnRNb2RpZmllZERlc2MiOmZhbHNlLCJzb3J0UmFuZG9tIjpmYWxzZSwic29ydFJlc2Vydm9pclBvb2wiOjEwMDAsInNvcnRSZXNlcnZvaXJTYW1wbGUiOiI0Iiwic29ydFRpdGxlQXNjIjpmYWxzZSwic29ydFRpdGxlRGVzYyI6ZmFsc2UsInNvdXJjZSI6WyJkb2NjbG91ZCJdLCJ0YWdzVXJsIjoid3d3LmFkb2JlLmNvbS9jaGltZXJhLWFwaS90YWdzIiwidGFyZ2V0QWN0aXZpdHkiOiIiLCJ0YXJnZXRFbmFibGVkIjpmYWxzZSwidGhlbWUiOiJsaWdodGVzdCIsInRpdGxlSGVhZGluZ0xldmVsIjoiaDMiLCJ0b3RhbENhcmRzVG9TaG93IjoiIiwidXNlTGlnaHRUZXh0IjpmYWxzZSwidXNlT3ZlcmxheUxpbmtzIjpmYWxzZSwiY29sbGVjdGlvbkJ1dHRvblN0eWxlIjoicHJpbWFyeSIsInVzZXJJbmZvIjpbXSwiYWNjZXNzaWJpbGl0eUxldmVsIjoiMiJ9';
  cardCollection.textContent = 'CaaS';

  block.before(document.createElement('hr'));
  block.replaceWith(cardCollection);
}