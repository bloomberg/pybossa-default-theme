<template>
    <div>
        <h4>Accuracy</h4>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Correct Answers</th>
                    <th>Wrong Answers</th>
                    <th>Total Answers</th>
                    <th>% Correct</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{numRight}}</td>
                    <td>{{numWrong}}</td>
                    <td>{{total}}</td>
                    <td>{{accuracyPercentage}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    props: ['stats'],

    computed: {
        numRight () {
            return this.stats.reduce((p, c) => {
                return p + c.info.right
            }, 0);
        },

        numWrong () {
            return this.stats.reduce((p, c) => {
                return p + c.info.wrong
            }, 0);
        },

        total () {
            return this.numRight + this.numWrong;
        },

        accuracyPercentage () {
            return (100 * this.numRight / this.total).toFixed(2);
        }
    }
}
</script>
<style>
</style>
