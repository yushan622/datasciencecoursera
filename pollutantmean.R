get_file_col <- function(directory, pollutant, id) {
    ## 'directory' is a character vector of length 1 indicating
    ## the location of the CSV files
    
    ## 'pollutant' is a character vector of length 1 indicating
    ## the name of the pollutant for which we will calculate the
    ## mean; either "sulfate" or "nitrate"
    
    ## 'id' is an integer vector of length 1 indicating the monitor ID
    
    ## Return a vector with valid numbers (ignoring NA values)
    ## for specified pollutant for specified monitor id
    file <-
        paste(directory, "/", sprintf("%03.f", id), ".csv", sep = "")
    ds <- read.csv(file, header = TRUE)
    out <- ds[complete.cases(ds[[pollutant]]), pollutant]
    out
}

pollutantmean <- function(directory, pollutant, id = 1:332) {
    ## 'directory' is a character vector of length 1 indicating
    ## the location of the CSV files
    
    ## 'pollutant' is a character vector of length 1 indicating
    ## the name of the pollutant for which we will calculate the
    ## mean; either "sulfate" or "nitrate"
    
    ## 'id' is an integer vector indicating the monitor ID numbers
    ## to be used
    
    ## Return the mean of the pollutant across all monitors list
    ## in the 'id' vector (ignoring NA values)
    x <- NULL
    for (i in id) {
        x <- c(x, get_file_col(directory, pollutant, i))
    }
    mean(x)
}
complete <- function(directory, pollutant, id = 1:332) {
    ## 'directory' is a character vector of length 1 indicating
    ## the location of the CSV files
    
    ## 'id' is an integer vector indicating the monitor ID numbers
    ## to be used
    
    ## Return a data frame of the form:
    ## id nobs
    ## 1  117
    ## 2  1041
    ## ...
    ## where 'id' is the monitor ID number and 'nobs' is the 
    ## number of complete cases
    total <- numeric()
    df
    for (i in id) {
        x <- 0
        file <-
            paste(directory, "/", sprintf("%03.f", id), ".csv", sep = "")
        ds <- read.csv(file, header = TRUE)
        out <- ds[complete.cases(ds[[pollutant]]),]
        print(out)
        print(nrow(out))
        print(total)
        append(total, nrow(out))
        print(total)
    }
    data.frame(id = id, nobs = total)
}