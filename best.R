best <- function(state, outcome) {
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
    
    ## Return hospital name in that state with lowest 30-day death
    ## rate
    
    ## Get data set for specified state, filter data and only leave "Hospital Name" and related "Rate" columns
    state_set <- data[(data["State"]==state), c("Hospital.Name", args_col_name[m])]
    
    ## Rename columns for easy code
    colnames(state_set) <- c("Hospital.Name", "Rate")
    
    ## Convert character rate to numeric
    suppressWarnings(state_set$Rate <- as.numeric(state_set$Rate))

    ## Find out minimum rate number for the set
    min <- min(state_set["Rate"], na.rm = TRUE)

    ## Find records with minimum rate. This could return multiple records
    top <- state_set[complete.cases(state_set["Rate"]) & state_set["Rate"]==min,]

    ## Get hospital names for those has minimum rate
    t <- top[,1]
    
    ## Sort set by hospital name and return the first one
    print(sort(t)[1])
}