export default function PreLoader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
        }
        @-webkit-keyframes spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}