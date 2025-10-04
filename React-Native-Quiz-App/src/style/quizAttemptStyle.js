import { StyleSheet } from "react-native";

 export default StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#F0F4F8"
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#F0F4F8" 
  },
  
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center", 
    color: "#1E2A38" 
  },

  card: { 
    marginBottom: 16, 
   
    padding: 16, 
    backgroundColor: "#ecb4b4ff", 
    borderRadius: 12, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 4 
  },

  question: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 12, 
    color: "#1E2A38" 
  },

  option: { 
    padding: 12, 
    borderWidth: 1, 
    borderColor: "#B0C4DE", 
    borderRadius: 10, 
    marginBottom: 10, 
    backgroundColor: "#DDE6F7" 
  },
  selected: { 
    backgroundColor: "#dd85a0ff", 
    borderColor: "black", 
  },
  optionText: { 
    color: "#1E2A38", 
    fontSize: 15 
  },
  
  submitBtn: {
    backgroundColor: "#007BFF", 
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  submitText: { 
    color: "#FFFFFF", 
    fontSize: 18, 
    fontWeight: "bold" 
  },

  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5", 
    padding: 20,
  },
  resultCard: {
    width: "90%",
    padding: 25,
    borderRadius: 12,
    backgroundColor: "#FFFFFF", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  
  resultText: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#1E2A38" 
  },
  resultScore: { 
    fontSize: 20, 
    fontWeight: "600", 
    textAlign: "center", 
    marginTop: 10, 
    color: "#007BFF" 
  },
  redirectText: { 
    marginTop: 20, 
    fontSize: 14, 
    color: "#7F8C8D", 
    textAlign: "center" 
  },
});
