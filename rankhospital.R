## The function returns the right hospital for specified state, outcome and rank.
rankhospital <- function(state, outcome, num = "best") {
    ## Read outcome data
    data <-
        read.csv("outcome-of-care-measures.csv", colClasses = "character")

    ## Check that state is valid
    st_col <- data[complete.cases(data[, 7]), 7]
    if (!(state %in% st_col)) {
        stop("invalid state")
    }
    
    ## Check that outcome is valid
    args_type <- c("heart attack", "heart failure", "pneumonia")
    args_col_name <-
        c(
            "Hospital.30.Day.Death..Mortality..Rates.from.Heart.Attack",
            "Hospital.30.Day.Death..Mortality..Rates.from.Heart.Failure",
            "Hospital.30.Day.Death..Mortality..Rates.from.Pneumonia"
        )
    if (!(state %in% st_col)) {
        stop("invalid state")
    }
    
    m <- match(outcome, args_type)

    if (is.na(m)) {
        stop("invalid outcome")
    }
    
    ## Return hospital name in that state with the given rank 30-day death
    ## rate
    
    ## Get data set for specified state, filter data and only leave "Hospital Name" and related "Rate" columns
    state_set <- data[(data["State"]==state), c("Hospital.Name", args_col_name[m])]
    
    ## Rename columns for easy code
    colnames(state_set) <- c("Hospital.Name", "Rate")
    
    ## Convert character rate to numeric
    suppressWarnings(state_set$Rate <- as.numeric(state_set$Rate))

    ## Get rid off records with invalid rates.
    clean_set <- state_set[complete.cases(state_set["Rate"]),]
    
    ## Get data sorted by rate and hospital name
    sort_set <- clean_set[order(clean_set$Rate, clean_set$Hospital.Name),]
    
    ## Determine rank number based on input num argument
    rank <- 1
    if(num=="best") {
        
    } else if (num=="worst") {
        rank <- nrow(sort_set)
    } else {
        rank <- as.integer(num)
    }

    ## print the right hospital name
    print(sort_set[rank,1])
}