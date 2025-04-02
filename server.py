from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

votes = {"A": {}, "B": {}}  

# Route for serving the web page
@app.route("/")
def home():
    return render_template("index.html")  

@app.route('/reset_votes', methods=['POST'])
def reset_votes():
    global votes
    votes = {"A": {}, "B": {}}  # Reset all votes
    return jsonify({"message": "All votes have been reset!"})



@app.route('/vote', methods=['GET'])
def vote():
    candidate = request.args.get("candidate")
    machine = request.args.get("machine")  

    if not candidate or not machine:
        return jsonify({"error": "Missing candidate or machine ID"}), 400

    if machine not in votes:
        return jsonify({"error": "Invalid machine"}), 400

    candidate = f"Candidate {candidate}"  # Format candidate name

    if candidate not in votes[machine]:
        votes[machine][candidate] = 0
    votes[machine][candidate] += 1

    return jsonify({"message": f"Vote recorded for {candidate} on Machine {machine}"})

@app.route('/get_results', methods=['GET'])
def get_results():
    total_votes = {}
    formatted_votes = {}

    for machine, candidates in votes.items():
        for candidate, count in candidates.items():
            candidate_num = candidate.split(" ")[1]  # Extract number from "Candidate X"
            key = f"{machine}{candidate_num}"  # Format as A1, B1, etc.
            formatted_votes[key] = count

            # Aggregate total votes
            total_key = f"Total{candidate_num}"
            if total_key not in total_votes:
                total_votes[total_key] = 0
            total_votes[total_key] += count

    return jsonify({**formatted_votes, **total_votes})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
