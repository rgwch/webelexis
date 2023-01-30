import plugin from 'windicss/plugin'

export default {
  shortcuts: {
    roundbutton: "whitespace-nowrap bg-blue-500 font-bolder text-white px-3 transition duration-300 ease-in-out hover:bg-blue-600 mr-6 rounded-full h-8 align-middle",
    scrollpanel: "bg-green-200 static overflow-x-hidden overflow-y-auto max-h-[80vh] h-4/5",
    testclass: "bg-red-300 text-blue-700",
    panel: "bg-green-100 border-2 rounded-md p-3",
  },
  plugins: [
    plugin(({ addComponents }) => {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          'backgroundColor': '#3490dc',
          'color': '#fff',
          '&:hover': {
            backgroundColor: '#2779bd',
          },
        },
        '.btn-red': {
          'backgroundColor': '#e3342f',
          'color': '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a',
          },
        },
      }
      const tooltip = {
        ".tooltip": {
          position: "relative",
          display: "inline-block"
        },
        ".tooltip .tooltiptext": {
          visibility: "hidden",
          width: "120px",
          backgroundColor: "#555",
          color: "#fff",
          textAlign: "center",
          padding: "5px 0",
          borderRadius: "6px",

          position: "absolute",
          zIndex: "1",
          bottom: "0",
          left: "50%",
          marginLeft: "10px",

          opacity: "0",
          transition: "opacity 0.3s"
        },
        ".tooltip:hover .tooltiptext": {
          visibility: "visible",
          opacity: "1"
        }

      }
      addComponents(tooltip)
    }),
  ]
}
