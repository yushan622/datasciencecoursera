## Get right hospital for speicified rank from sorted input data set
get_ranked_hospital <- function(x, num) {
    ## Determine rank number based on input num argument
    rank <- 1
    if(num=="best") {
    } else if (num=="worst") {
        rank <- length(x)
    } else {
        rank <- as.integer(num)
    }
    
    if(!is.null(x) & rank > length(x)) {
        NA
    } else {
        x[rank]
    }
}

## The function returns a data frame containing the names of the hospitals that
## are the best in their respective states for 30-day death rates
rankall <- function(outcome, num = "best") {
    ## Read outcome data
    data <-
        read.csv("outcome-of-care-measures.csv", colClasses = "character")

    ## Check that state is valid
    ##st_col <- data[complete.cases(data[, 7]), 7]

    ## Check that outcome is valid
    args_type <- c("heart attack", "heart failure", "pneumonia")
    args_col_name <-
        c(
            "Hospital.30.Day.Death..Mortality..Rates.from.Heart.Attack",
            "Hospital.30.Day.Death..Mortality..Rates.from.Heart.Failure",
            "Hospital.30.Day.Death..Mortality..Rates.from.Pneumonia"
        )

    m <- match(outcome, args_type)

    if (is.na(m)) {
        stop("invalid outcome")
    }
    
    ## Return hospital name in that state with the given rank 30-day death
    ## rate
    
    ## Get data set for specified state, filter data and only leave "Hospital Name" and related "Rate" columns
    full_set <- data[, c("Hospital.Name", args_col_name[m], "State")]
    
    ## Rename columns for easy code
    colnames(full_set) <- c("Hospital.Name", "Rate", "State")
    
    ## Convert character rate to numeric
    suppressWarnings(full_set$Rate <- as.numeric(full_set$Rate))

    ## Get rid off records with invalid rates.
    clean_set <- full_set[complete.cases(full_set["Rate"]),]
    
    ## Get data sorted by rate and hospital name
    sort_set <- clean_set[order(clean_set$State, clean_set$Rate, clean_set$Hospital.Name),]
    
    df <- tapply(sort_set$Hospital.Name, sort_set$State, function(x) get_ranked_hospital(x, num))
    ## print the right hospital name
    ##print(sort_set[rank,1])
    
    f <- as.data.frame.table(df)
    colnames(f) <- c("state", "hospital")
    rownames(f) <- f$state
    f[, c(2,1)]
}